class V1::NoticesController < V1::BaseController 
  before_action :load_notice, only: [:show]
  impressionist actions: [:show]

  def index
    notices = Notice.order(created_at: :desc).page(params[:page])
    render json: each_serialize(notices)
  end

  def show
    render json: serialize(@notice)
  end

  def new
    @notice = Notice.new
  end

  def create
    @notice = Notice.create notices_params
    after_result(notices_path, '공지사항을 등록하였습니다.', @notice)
  end

  private
  def notices_params
    params.require(:notice).permit(:title, :body)
  end

  def load_notice
    @notice = Notice.find params[:id]
  end
end