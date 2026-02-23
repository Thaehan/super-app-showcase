require 'xcodeproj'

project_path = 'host.xcodeproj'
project = Xcodeproj::Project.open(project_path)

project.targets.each do |target|
  if target.name == 'host'
    target.build_configurations.each do |config|
      flags = config.build_settings['OTHER_LDFLAGS']
      if flags.nil?
        flags = ['$(inherited)']
      elsif flags.is_a?(String)
        flags = [flags]
      end
      flags << '-lz' unless flags.include?('-lz')
      flags << '-lc++' unless flags.include?('-lc++')
      config.build_settings['OTHER_LDFLAGS'] = flags
      puts "Updated OTHER_LDFLAGS for #{target.name} (#{config.name}): #{flags}"
    end
  end
end

project.save
puts "Successfully patched host.xcodeproj"
