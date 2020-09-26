module Fastlane
  module Actions
    class SetAndroidVersionAction < Action
      def self.run(params)
        version_name = params[:version_name]
        version_code = params[:version_code]
        path = params[:build_gradle_path]

        replace_in_place(
          path,
          /versionName\s+"(.+)"/,
          "versionName \"#{version_name}\""
        )

        replace_in_place(
          path,
          /versionCode\s+(\d+)/,
          "versionCode #{version_code}"
        )
      end

      def self.available_options
        [
          FastlaneCore::ConfigItem.new(
            key: :version_name,
            description: 'The new version name to use',
            optional: false,
            is_string: true
          ),
          FastlaneCore::ConfigItem.new(
            key: :version_code,
            description: 'The new version code to use',
            optional: false,
            is_string: true
          ),
          FastlaneCore::ConfigItem.new(
            key: :build_gradle_path,
            env_name: 'BUILD_GRADLE_PATH',
            description: 'The path to the build.gradle file for the app',
            optional: false,
            is_string: true
          )
        ]
      end

      def self.replace_in_place(path, regex, replacement)
        File.write(
          path,
          File.read(path).gsub(
            regex,
            replacement
          )
        )
      end
    end
  end
end
