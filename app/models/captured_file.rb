# == Schema Information
#
# Table name: captured_files
#
#  id            :integer          not null, primary key
#  path          :string(255)
#  created_at    :datetime
#  updated_at    :datetime
#  mime_type     :string(255)
#  annotation_id :integer
#

require "#{Rails.root}/lib/file_saver.rb"

class CapturedFile < ActiveRecord::Base
  belongs_to :annotation
  attr_accessor :content
  before_create :save_file
  after_destroy :delete_file
  
  # TODO Validate precense of annotation
  # TODO Clean up file, if save fails
  
  def save_file
    if Rails.configuration.file_storage_method == "fs"
      FileSaver.save_to_fs annotation.uuid, path, content
    elsif Rails.configuration.file_storage_method == "s3"
      FileSaver.save_to_s3 annotation.uuid, path, content
    else
      raise "Illegal file storage method #{Rails.configuration.file_storage_method}"
    end
  end
  
  def delete_file
    if Rails.configuration.file_storage_method == "fs"
      FileSaver.delete_from_fs annotation.uuid, path
    elsif Rails.configuration.file_storage_method == "s3"
      FileSaver.delete_from_s3 annotation.uuid, path
    else
      raise "Illegal file storage method #{Rails.configuration.file_storage_method}"
    end
  end
  
end
