module Imagable
  extend ActiveSupport::Concern
  included do
    has_many :images, as: :imagable, dependent: :destroy
    accepts_nested_attributes_for :images, reject_if: :all_blank, allow_destroy: true
  end
end
