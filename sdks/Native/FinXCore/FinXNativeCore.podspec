Pod::Spec.new do |s|
  s.name             = 'FinXCore'
  s.version          = '0.1.0'
  s.summary          = 'FinX native core bundle (Keychain, Biometrics, Crypto helpers)'
  s.homepage         = 'https://finx.example.com'
  s.license          = { :type => 'MIT' }
  s.author           = { 'FinX' => 'FinX' }
  s.source           = { :path => '.' }

  s.platform         = :ios, '15.0'
  s.swift_version    = '5.0'
  s.requires_arc     = true

  # Consume the prebuilt XCFramework from dist
  s.vendored_frameworks = 'dist/ios/FinXCore.xcframework'
  s.frameworks       = ['Foundation', 'Security', 'LocalAuthentication']
end
