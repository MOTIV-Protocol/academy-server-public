class Like < ApplicationRecord
  belongs_to :user
  belongs_to :school, counter_cache: :like_count
end
