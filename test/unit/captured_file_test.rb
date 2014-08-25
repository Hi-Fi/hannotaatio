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

require 'test_helper'

class CapturedFileTest < ActiveSupport::TestCase

end
