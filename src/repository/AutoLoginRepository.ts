import { Store } from "tauri-plugin-store-api";
import { Token } from "../store/AuthSlice";

interface AutoLogin {
  token: Token;
}

class AutoLoginRepository {
  static AUTOLOGIN = "AUTOLOGIN";
  private store: Store = new Store(".settings.data");
  AutoLoginRepository() {}

  async getAutoLogin() {
    const result = await this.store.get(AutoLoginRepository.AUTOLOGIN);
    return result as any as AutoLogin;
  }

  async setAutoLogin(autoLogin: AutoLogin) {
    await this.store.set(AutoLoginRepository.AUTOLOGIN, autoLogin);
    await this.store.save();
    return;
  }
}
