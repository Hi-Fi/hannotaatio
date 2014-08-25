class NotificationEmail < ActiveRecord::Base
  belongs_to :annotation
  
  validates :email, presence: true
  validates :email, :presence => true, :format => { :with => /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\Z/i, :message => 'email must be valid' }
  
  before_validation :replace_at_and_dot
  
  def replace_at_and_dot
    email.gsub! ' at ', '@'
    email.gsub! ' dot ', '.'
  end
  
end
