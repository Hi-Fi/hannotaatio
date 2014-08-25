require 'rbconfig'
# Create symlink to the captured files location

host_os = RbConfig::CONFIG['host_os']

public_path = HannotaatioServerNew::Application.config.file_storage_public_path
symlink_path = "#{Rails.root}/public/#{public_path}"

os =
  case host_os
  when /mswin|msys|mingw|cygwin|bccwin|wince|emc/
"windows"
  when /darwin|mac os/
"macosx"
  when /linux/
"linux"
  when /solaris|bsd/
"unix"
  else
raise "unknown os: #{host_os.inspect}"
  end

if (os == "windows")
	local_path=symlink_path
	if File.directory? local_path
		# Everything ok
	else
		puts FileUtils.mkdir_p local_path
	end
else
	local_path = HannotaatioServerNew::Application.config.file_storage_local_path

	if File.directory? local_path and File.symlink? symlink_path
		# Everything ok
	else
		puts FileUtils.mkdir_p local_path
		FileUtils.ln_s local_path, symlink_path, :force => true
	end
end