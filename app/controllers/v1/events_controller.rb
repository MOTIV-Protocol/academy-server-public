class V1::EventsController < V1::BaseController

  def index
    events = Event.ransack(params[:q]).result
    events = events.limit params[:limit] if params[:limit].present?
    render json: each_serialize(events)
  end

  def show
    render json: serialize(Event.find params[:id])
  end

end
