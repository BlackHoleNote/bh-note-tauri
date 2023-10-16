use log::kv::ToValue;
use jsonwebtoken::{decode, DecodingKey};

pub struct CustomSchemeURLParser {

}

#[derive(Clone, serde::Deserialize, serde::Serialize, Debug)]
pub struct Token {
    token: String,
    refesh_token: String,
    // id: String
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

    pub fn login(target: &str) -> Option<Token> {
        if let Ok(urlStr) = url::Url::parse(target) {
            if let Some(host) = urlStr.host() {
                if host.to_string() == "login" {
                    // urlStr.query_pairs()
                    
                    if let Some(token) = urlStr.query_pairs().find(|x| {
                        x.0 == "token"
                    }) {
                        if let Some(refresh_token) = urlStr.query_pairs().find(|x| {
                            x.0 == "refreshToken"
                        }) {
                            // let id = decode(&(token.1), &DecodingKey::from_secret(secret));
                            return Some(Token { token: token.1.to_string(), refesh_token: refresh_token.1.to_string() });
                        }
                    }
                }
            }
        }
        return None;
    }
}

#[cfg(test)]
mod tests {
    use super::CustomSchemeURLParser;

    // #[Debug]
    // impl CustomSchemeURLParser {
        
    // }

    #[test]
    fn loginTest() {
        let parser = CustomSchemeURLParser {};
        let result = CustomSchemeURLParser::login("blackhole://login?token=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzaWxiYXBhZEBnbWFpbC5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTY5Njk0MzY0NSwiZXhwIjoxNjk2OTQ0MjQ1fQ.dWqEuaDsRg3rnDnhdhHIpbmN7P6s4bHjXGRogu7vvj4&refreshToken=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzaWxiYXBhZEBnbWFpbC5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTY5Njk0MzY0NSwiZXhwIjoxNzA0NzE5NjQ1fQ.YjlXrzFz-C5SDlou2CcZdBzTpUTPF4p_4wyw2-Fm63A");
        if let Some(token) = result {
            assert_eq!(token.token, String::from("eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzaWxiYXBhZEBnbWFpbC5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTY5Njk0MzY0NSwiZXhwIjoxNjk2OTQ0MjQ1fQ.dWqEuaDsRg3rnDnhdhHIpbmN7P6s4bHjXGRogu7vvj4")); 
        } else {
            assert!(false);
        }
    }
}