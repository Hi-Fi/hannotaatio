HannotaatioServerNew::Application.routes.draw do

  scope "/api" do

    resources :annotations, :only => [:show, :create, :destroy] do
    
      resources :annotations, :only => [:index, :create], :controller => :hannotations
    
      get "/capture" =>       "captured_files#index", via: [:get]
      get "/capture/*path" => "captured_files#show", via: [:get]
    
    end
  
    resources :api_key, :only => [:create]
  
  end
  
  get "/view/:uuid" => "view#index"

end
