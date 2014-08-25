# == Schema Information
#
# Table name: hannotations
#
#  id            :integer          not null, primary key
#  created_at    :datetime
#  updated_at    :datetime
#  body          :text
#  annotation_id :integer
#

class Hannotation < ActiveRecord::Base
  belongs_to :annotation
end
