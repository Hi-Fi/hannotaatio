class ApiKeyController < ApplicationController

  def create

    @api_key = ApiKey.new(api_key_params)
	
    if !(@api_key.save)
      if @api_key.errors.any?
        render :text => @api_key.errors.full_messages.join(", "), :status => 400 and return
      elsif
        render :text => "Failed saving annotation object.", :status => 500 and return
      end
    end
    
    render :json => @api_key, :status => 201
    
    if @api_key.email != nil
      NotificationMailer.new_api_key(@api_key).deliver
    end
  end
  
  private
	def api_key_params
		params.fetch(:api_key, {}).permit(:api_key, :email)
	end

end
