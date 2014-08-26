require 'aws/s3'
require 'logger'

class FileSaver
  
  def self.create_fs_path uuid, path
    "#{Rails.configuration.file_storage_local_path}/#{uuid}/#{path}"
  end
  
  def self.save_to_fs (uuid, path, content)
    file_path = create_fs_path uuid, path
    FileUtils.mkdir_p File.dirname file_path
    
    File.open(file_path, 'wb') do |f| 
      f.write(content)
    end
    
    Rails.logger.info "File saved to #{file_path}"
    
    # Return file_path
    file_path
  end
  
  def self.save_to_s3 (uuid, path, content)
    file_extension = File.extname(path)[1..-1]
    mime_type = file_extension.nil? ? nil : Mime::Type.lookup_by_extension(file_extension)
	
	s3 = AWS::S3.new
	filename = "#{uuid}/#{path}"
	obj = s3.buckets[Rails.configuration.s3_bucket].objects[filename]	
    obj.write(content)
	obj.copy_to(obj.key, :content_type => mime_type)
	obj.acl = :public_read
    
    Rails.logger.info "File saved to S3 region: #{Rails.configuration.s3_region}, bucket: #{Rails.configuration.s3_bucket}, object: #{uuid}/#{path}"
  end
  
  def self.delete_from_fs uuid, path
    file_path = create_fs_path uuid, path
    FileUtils.remove_file file_path if File.exists? file_path
    FileUtils.rmdir File.dirname file_path
  end
  
  def self.delete_from_s3 uuid, path
  	s3 = AWS::S3.new
	bucket = s3.buckets[Rails.configuration.s3_bucket]
	object = bucket.objects["#{uuid}/#{path}"]
    object.delete
  end
end