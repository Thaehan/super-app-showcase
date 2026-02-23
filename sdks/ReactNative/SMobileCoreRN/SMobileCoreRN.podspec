require "json"
require "pathname"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "SMobileCoreRN"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => min_ios_version_supported }
  s.source       = { :git => ".git", :tag => "#{s.version}" }

  s.source_files = [
    "ios/**/*.{swift}",
    "ios/**/*.{m,mm}",
    "cpp/**/*.{hpp,cpp}",
  ]

  s.dependency 'React-jsi'
  s.dependency 'React-callinvoker'

  # Vendored native SDK bundle (now SMobileCore, contains Keychain and future modules)
  finxcore_path = File.expand_path("native-sdk/ios/SMobileCore.xcframework", __dir__)
  relative_finxcore = Pathname.new(finxcore_path).relative_path_from(Pathname.new(__dir__)).to_s
  s.vendored_frameworks = relative_finxcore
  # s.frameworks = ['Foundation', 'Security']

  load 'nitrogen/generated/ios/SMobileCoreRN+autolinking.rb'
  add_nitrogen_files(s)

  install_modules_dependencies(s)
end
