RailsAdmin.config do |config|
	config.authorize_with do
		redirect_to "#{RAILS_ROOT}/admin" unless authenticate_or_request_with_http_basic do |user_name, password|
			user_name == Keys.admin_username && password == Keys.admin_password
		end
	end
	
	config.actions do
		dashboard                     # mandatory
		index                         # mandatory
		new
		export
		bulk_delete
		show
		edit
		delete
		# show_in_app
		## With an audit adapter, you can add:
		# history_index
		# history_show
	end
end
