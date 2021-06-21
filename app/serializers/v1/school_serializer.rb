class V1::SchoolSerializer < V1::BaseSerializer
  attributes :id, :name, :location, :introduce, :location_info, :business_number, :business_owner,
    :business_brand, :business_address, :opening_time, :phone, :statistics, :lat, :lng,
    :review_counts, :review_count, :like_count, :comment_count, :order_count, :average_score
  has_many :images, each_serializer: self.module_parent::ImageEachSerializer
  has_many :reviews, each_serializer: self.module_parent::ReviewEachSerializer

  def review_counts
    reviews = object.reviews
    [
      { score: 5, count: reviews.ransack(score_gt: 4, score_lteq: 5).result.size },
      { score: 4, count: reviews.ransack(score_gt: 3, score_lteq: 4).result.size },
      { score: 3, count: reviews.ransack(score_gt: 2, score_lteq: 3).result.size },
      { score: 2, count: reviews.ransack(score_gt: 1, score_lteq: 2).result.size },
      { score: 1, count: reviews.ransack(score_gteq: 0, score_lteq: 1).result.size }
    ]
  end

end