# == Schema Information
#
# Table name: notification_emails
#
#  id            :integer          not null, primary key
#  email         :string(255)
#  created_at    :datetime
#  updated_at    :datetime
#  annotation_id :integer
#

class NotificationEmail < ActiveRecord::Base
  belongs_to :annotation
  
  validates :email, presence: true
  validates :email, :presence => true, 
				    :email_format => {:message => 'must be valid' }
  
  before_validation :replace_at_and_dot
  
  def replace_at_and_dot
    email.gsub! ' at ', '@'
    email.gsub! ' dot ', '.'
  end
  
end
