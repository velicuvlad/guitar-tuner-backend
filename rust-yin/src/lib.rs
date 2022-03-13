mod utils;

use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;


// Implementation of the Yin algorithm in rust making use of js_sys to pass the Float32Array to the algorithm
#[wasm_bindgen]
pub fn get_pitch(float_32_audio_buffer: &js_sys::Float32Array, threshold: f32, sample_rate: i32, probability_threshold: f32) -> f32 {
    use web_sys::console;
    const half_buffer_size: i32 = 4096 / 2;
    let rust_buffer = float_32_audio_buffer.to_vec();
    let mut yin_buffer: [f32; half_buffer_size as usize] = [0.0; half_buffer_size as usize];
    let mut tau_estimate = -1;
    let mut pitch_in_hz: f32 = -1.0;
    let mut estimation_probability = 0.0;
    for i in 0..half_buffer_size {
        yin_buffer[i as usize] = 0.0;
    }

    let mut index: i32;
    let mut tau: i32 = 0;
    let mut delta: f32;
    for i in 0..half_buffer_size {
        for index in 0..half_buffer_size {
            delta = rust_buffer[index as usize] - rust_buffer[(index + i) as usize];
            yin_buffer[i as usize] += delta * delta;
        }
    }
    let mut running_sum: f32 = 0.0;
    yin_buffer[0] = 1.0;
    for i in 1..half_buffer_size {
        running_sum += yin_buffer[i as usize];
        yin_buffer[i as usize] *= i as f32 / running_sum;
    }

    for i in 2..half_buffer_size {
        tau = i;
        if yin_buffer[tau as usize] < threshold {
            while tau + 1 < half_buffer_size && yin_buffer[(tau + 1) as usize] < yin_buffer[tau as usize] {
                tau += 1;
            }
            estimation_probability = (1.0 - yin_buffer[tau as usize]) as f32;
            break;
        }
    }

    if tau == half_buffer_size || yin_buffer[tau as usize] >= threshold {
        tau = -1;
        estimation_probability = 0.0;
    }

    if estimation_probability < probability_threshold {
       return -1.0;
    }

    tau_estimate = tau;

    if tau_estimate != -1 {
        let better_tau: f32;
        let x0: i32;
        let x2: i32;

        if tau_estimate < 1 {
            x0 = tau_estimate;
        }else{
            x0 = tau_estimate - 1;
        }

        if tau_estimate + 1 < half_buffer_size {
            x2 = tau_estimate + 1;
        }else{
            x2 = tau_estimate;
        }

        if x0 == tau_estimate {
            if yin_buffer[tau_estimate as usize] <= yin_buffer[x2 as usize]{
                better_tau = tau_estimate as f32;
            }else{
                better_tau = x2 as f32;
            }
        }else if x2 == tau_estimate{
            if yin_buffer[tau_estimate as usize] <= yin_buffer[x0 as usize] {
                better_tau = tau_estimate as f32;
            }else{
                better_tau = x0 as f32;
            }
        } else {
            let s0: f32;
            let s1: f32;
            let s2: f32;
            s0 = yin_buffer[x0 as usize];
            s1 = yin_buffer[tau_estimate as usize];
            s2 = yin_buffer[x2 as usize];
            better_tau = tau_estimate as f32 + (s2 - s0) / (2.0 * (2.0 * s1 - s2 - s0));
        }
        pitch_in_hz = sample_rate as f32 / better_tau;
    }
    return pitch_in_hz;
}
