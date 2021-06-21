class V1::CommentEachSerializer < V1::BaseSerializer
  attributes :id, :body, :user, :created_at, :review
  def user
    object.user.as_json(only: [:name], methods: [:image_path])
  end

  def review
    object.target if object.target_type == "Review"
  end
end