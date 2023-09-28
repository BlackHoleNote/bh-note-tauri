use log::kv::ToValue;

pub struct CustomSchemeURLParser {

}

impl CustomSchemeURLParser {
    pub fn findGithubAuthCode(target: &str) -> Option<String> {
        if let Ok(urlStr) = url::Url::parse(target) {
            if let Some(host) = urlStr.host() {
                if host.to_string() == "login" {
                    if let Some(code) = urlStr.query_pairs().find(|x| {
                        x.0 == "code"
                    }) {
                        return Some(code.1.to_string());
                    }
                }
            }
        }
        
        return Option::None;
    }
}