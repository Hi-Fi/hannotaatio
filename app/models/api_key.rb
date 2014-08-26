# == Schema Information
#
# Table name: api_keys
#
#  id         :integer          not null, primary key
#  api_key    :string(255)
#  email      :string(255)
#  created_at :datetime
#  updated_at :datetime
#

class ApiKey < ActiveRecord::Base
  has_many :annotation, :dependent => :destroy
  
  before_validation :generate_api_key
  
  validates :api_key, :presence => true, 
                      :uniqueness => true
  validates :email, :presence => true, 
					:email_format => { :message => 'must be valid', :allow_nil => false}
  
  private
	def generate_api_key
		self.api_key = SecureRandom.hex(20)
	end
end
