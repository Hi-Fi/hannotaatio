ses = AWS::SimpleEmailService.new(
      :access_key_id     => Keys.aws_access_key_id,
      :secret_access_key => Keys.aws_secret_access_key
	  )
	  
ActionMailer::Base.add_delivery_method :amazon_ses, ses