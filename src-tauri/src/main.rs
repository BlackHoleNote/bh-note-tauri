// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod test;
mod url_parser;

use tauri::{Manager, http};
use tauri_plugin_log::{LogTarget};
use log::{info, warn, error, debug, trace};

use crate::url_parser::CustomSchemeURLParser;


// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[derive(Clone, serde::Deserialize, Debug)]
struct KeydownDTO {
  key: String,
}

#[derive(serde::Deserialize, Debug)]
struct LogDTO {
    title: Option<String>,
    string: String,
    logLevel: Option<String>
}

#[derive(serde::Deserialize, Debug)]
struct MockDeepLink {
    url: String
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hellssso, {}! You've been greeted from Rust!", name)
}


fn main() {
    tauri_plugin_deep_link::prepare("com.blackhole.dev");

    let mut builder = tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet]);

    #[cfg(target_os = "macos")]
    {
        builder = builder.plugin(tauri_plugin_log::Builder::default().targets([
            LogTarget::LogDir,
            LogTarget::Stdout,
            LogTarget::Webview,
        ]).build());
    }
    
    let app = builder.setup(|app| {
        let handle = app.handle();
        let id = app.listen_global("keydown", |event: tauri::Event| {
            let deserialized: KeydownDTO = serde_json::from_str(event.payload().unwrap()).unwrap();
            println!("got event-name with payload2 {:?}", deserialized);
        });

        let logHandler = app.listen_global("console_log", |event: tauri::Event| {
            let deserialized: LogDTO = serde_json::from_str(event.payload().unwrap()).unwrap();
            let logLevel = deserialized.logLevel.to_owned().unwrap_or("test".to_owned());
            if (logLevel == "debug") {
                debug!("[🗒 Debug] 로그 발생 {:#?}", deserialized);
            } else if (logLevel == "error") {
                error!("[❌ Error] 로그 발생 {:#?}", deserialized);
            } else {
                println!("[❓ Unknown] 로그 발생 {:#?}", deserialized);
            }
        });

        let handle = app.handle();
        let customSchemeHandler = move |request: String| {
        if let Some(code) = CustomSchemeURLParser::findGithubAuthCode(&request) {
            debug!("{}", code);
            let result = handle.emit_all("login/oauth/code", code);
        } else if let Some(token) = CustomSchemeURLParser::login(&request) {
            debug!("{:?}", token);
            let result = handle.emit_all("login/jwt", &token);
        } else {
            error!("Invailid Custom Scheme call! {}", request);
        }
        };
        let _ = tauri_plugin_deep_link::register(
            "blackhole",
            customSchemeHandler.clone(),
        );

        if cfg!(debug_assertions) {
            app.listen_global("mock_deeplink",move |event: tauri::Event| {
                let deserialized: MockDeepLink = serde_json::from_str(event.payload().unwrap()).unwrap();
                println!("got event-name with payload2 {:?}", deserialized);
                customSchemeHandler(deserialized.url);
            });
        }
        Ok(())
    })
    .build(tauri::generate_context!())
    .expect("error while running tauri application");

    app.run(|_app_handle, event| match event {
        event => {
            // println!("other run event {:?}", event);
        }
        });
}

