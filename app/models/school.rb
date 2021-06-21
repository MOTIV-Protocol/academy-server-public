class School < ApplicationRecord
  include Mappable
  include Imagable
  paginates_per 8

  has_many :lectures, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :orders, -> { where({ status: "complete" }) }, dependent: :destroy
  has_many :reviews, through: :orders, source: :review
  has_many :comments, through: :reviews, source: :comment
  has_many :calculate_histories, through: :orders
  belongs_to :owner, class_name: "User", foreign_key: "owner_id", optional: true
  has_many :teachers, -> { where({ status: "accepted" }) }, class_name: "User", foreign_key: "school_id"
  
  accepts_nested_attributes_for :owner
end
