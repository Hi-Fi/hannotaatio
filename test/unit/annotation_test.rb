# == Schema Information
#
# Table name: annotations
#
#  id           :integer          not null, primary key
#  uuid         :string(255)
#  site_name    :string(255)
#  capture_time :datetime
#  captured_url :string(255)
#  created_at   :datetime
#  updated_at   :datetime
#  body_width   :decimal(, )
#  body_height  :decimal(, )
#  browser      :string(255)
#  api_key_id   :integer
#

require 'test_helper'

class AnnotationTest < ActiveSupport::TestCase

  test "should store api key id to annotation" do
    
    # Test without api key
    annotation = Annotation.new
    assert annotation.save
    assert_nil annotation[:api_key]
    
    # Test with api key
    api_key = ApiKey.new(:email => "apikeyemail@invalid.com")
    assert api_key.save
    api_key_value = api_key.api_key
    annotation = Annotation.new(:api_key => api_key)
    assert annotation.save
    
    annotation = Annotation.find_by_id(annotation.id)
    assert_not_nil annotation
    assert_not_nil annotation.api_key
    assert_equal api_key_value, annotation.api_key.api_key
    
  end

end
