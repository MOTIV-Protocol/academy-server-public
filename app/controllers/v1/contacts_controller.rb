class V1::ContactsController < V1::BaseController
  def index
    render json: each_serialize(current_api_user.contacts.all)
  end

  def create
    current_api_user.contacts.create contact_params
    render :ok
  end

  def update
    contact = current_api_user.contacts.find params[:id]
    contact.update contact_params
    render :ok
  end

  def show
    contact = current_api_user.contacts.find params[:id]
    render json: serialize(contact)
  end

  private
  def contact_params
    params.require(:contact).permit(:name, :email, :phone, :title, :content)
  end
end