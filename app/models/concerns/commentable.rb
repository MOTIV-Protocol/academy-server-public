module Commentable
  extend ActiveSupport::Concern
  included do
    has_one :comment, as: :target, dependent: :destroy
  end
end
