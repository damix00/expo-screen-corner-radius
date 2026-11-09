// iOS 27 stops apps that don't adopt the UIScene lifecycle at launch, and the Expo SDK 56
// template still creates its window in the app delegate. This plugin adds a scene manifest and
// a SceneDelegate that starts React Native in the scene's window.
//
// It matters here because the module reads the screen from the active window scene, and the
// iPhone Duo simulator needs iOS 27.
const {
    withAppDelegate,
    withInfoPlist,
} = require("expo/config-plugins");

const WINDOW_SETUP = /#if os\(iOS\) \|\| os\(tvOS\)\n\s*window = UIWindow\(frame: UIScreen\.main\.bounds\)\n\s*factory\.startReactNative\([\s\S]*?\)\n#endif\n/;

const SCENE_DELEGATE = `
class SceneDelegate: UIResponder, UIWindowSceneDelegate {
  var window: UIWindow?

  func scene(
    _ scene: UIScene,
    willConnectTo session: UISceneSession,
    options connectionOptions: UIScene.ConnectionOptions
  ) {
    guard
      let windowScene = scene as? UIWindowScene,
      let appDelegate = UIApplication.shared.delegate as? AppDelegate
    else { return }

    let window = UIWindow(windowScene: windowScene)
    self.window = window
    appDelegate.window = window
    appDelegate.reactNativeFactory?.startReactNative(
      withModuleName: "main",
      in: window,
      launchOptions: nil)
  }
}
`;

module.exports = function withSceneDelegate(config) {
    config = withInfoPlist(config, (config) => {
        config.modResults.UIApplicationSceneManifest = {
            UIApplicationSupportsMultipleScenes: false,
            UISceneConfigurations: {
                UIWindowSceneSessionRoleApplication: [
                    {
                        UISceneConfigurationName: "Default Configuration",
                        UISceneDelegateClassName:
                            "$(PRODUCT_MODULE_NAME).SceneDelegate",
                    },
                ],
            },
        };
        return config;
    });

    return withAppDelegate(config, (config) => {
        let contents = config.modResults.contents;
        if (contents.includes("class SceneDelegate")) return config;
        if (!WINDOW_SETUP.test(contents)) {
            throw new Error(
                "withSceneDelegate: the AppDelegate template changed; update the plugin."
            );
        }
        contents = contents.replace(
            WINDOW_SETUP,
            "    // The window is created in SceneDelegate.\n"
        );
        contents = contents.replace(
            /\nclass ReactNativeDelegate/,
            `${SCENE_DELEGATE}\nclass ReactNativeDelegate`
        );
        config.modResults.contents = contents;
        return config;
    });
};
