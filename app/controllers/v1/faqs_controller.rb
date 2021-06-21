class V1::FaqsController < V1::BaseController
  def index
    faqs = Faq.ransack(params[:q]).result
    render json: each_serialize(faqs)
  end

  def show
    faq = Faq.find params[:id]
    render json: serialize(faq)
  end

end