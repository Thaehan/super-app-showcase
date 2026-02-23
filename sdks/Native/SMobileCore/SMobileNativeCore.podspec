Pod::Spec.new do |s|
  s.name             = 'SMobileCore'
  s.version          = '0.1.0'
  s.summary          = 'SMobile native core bundle (Keychain, Biometrics, Crypto helpers)'
  s.homepage         = 'https://smobile.example.com'
  s.license          = { :type => 'MIT' }
  s.author           = { 'SMobile' => 'SMobile' }
  s.source           = { :path => '.' }

  s.platform         = :ios, '15.0'
  s.swift_version    = '5.0'
  s.requires_arc     = true

  # Consume the prebuilt XCFramework from dist
  s.vendored_frameworks = 'dist/ios/SMobileCore.xcframework'
  s.frameworks       = ['Foundation', 'Security', 'LocalAuthentication']
end
