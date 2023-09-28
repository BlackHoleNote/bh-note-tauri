#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        assert_eq!(2 + 2, 4);
    }

    #[test]
    fn urlParseInCustomScheme_works() {
        assert_eq!(url::Url::parse("blackhole://gihub/callback").is_err(), false);

        let blackhole = url::Url::parse("blackhole://github/callback").unwrap();
        
        assert_eq!(blackhole.scheme(), "blackhole");
        assert_eq!(blackhole.host().unwrap().to_string(), "github");
        assert_eq!(blackhole.path(), "/callback");

        if let Ok(urlStr) = url::Url::parse("blackhole://login/github?code=zivk3af3") {
            if let Some(host) = urlStr.host() {
                if host.to_string() == "login" {
                    // path parse
                    assert_eq!(urlStr.path(), "/github");

                    if let Some(code) = urlStr.query_pairs().find(|x| {
                        x.0 == "code"
                    }) {
                        assert_eq!("zivk3af3", code.1);
                    } else {
                        assert!(false);
                    };
                }
            }
        }
    }
}