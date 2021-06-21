class User < ApplicationRecord
  validates :name, presence: true, length: { maximum: 20 }

  include ImageUrl
  include Mappable
  USER_COLUMNS = %i(name email phone image address1 address2 zipcode gender status accept_sms accept_email lat lng point device_token device_type created_at updated_at role school_id)
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :trackable

  # 학생, 선생, 원장
  enum role: [:student, :teacher, :owner]
  ransacker :role, formatter: proc {|v| roles[v]}
  enum gender: [:male, :female]
  ransacker :gender, formatter: proc {|v| genders[v]}
  
  has_many :comments, dependent: :destroy
  has_many :reviews, dependent: :destroy
  has_many :user_coupons
  has_many :coupons, through: :user_coupons, dependent: :destroy
  has_many :orders, dependent: :destroy
  has_many :point_histories, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :liked_schools, through: :likes, source: :school
  has_many :contacts, dependent: :destroy
  has_and_belongs_to_many :lectures
  has_many :attendances, dependent: :destroy
  
  # 원장님 전용
  has_one :own_school, class_name: "School", foreign_key: "owner_id", dependent: :destroy
  
  # 선생님 전용
  enum status: [:wait, :accepted, :rejected]
  ransacker :status, formatter: proc {|v| statuses[v]}
  belongs_to :teaching_school, class_name: "School", foreign_key: "school_id", required: false
  has_many :teaching_lectures, class_name: "Lecture", foreign_key: "teacher_id"

  def send_push_message body, url="/", title = nil
    if self.device_token.present?
      title ||= "도움닫기"
      registration_ids = [self.device_token]
      options = { 
        priority: "high", 
        android_channel_id: "academy_channel_0610", 
        data: { title: title, body: body, url: url }, 
        collapse_key: "message_#{Time.zone.now.change(min: 0)}" 
      }
      options.merge(notification: { title: title, body: body, url: url, sound: 'default' }) if self.device_type == 'ios'

      FCM.new(Rails.application.credentials.dig(:fcm_key)).send(registration_ids, options)
    end
  end

  def self.send_multiple_push_message body, device_tokens = [], url = "/", title = "도움닫기"
    if device_tokens != []
      options = { 
        priority: "high", 
        android_channel_id: "academy_channel_0610", 
        data: { title: title, body: body, url: url }, 
        collapse_key: "message_#{Time.zone.now.change(min: 0)}" 
      }
      options.merge({notification: { title: title, body: body, url: url, sound: "default" }}) if self.device_type == "ios"

      device_tokens.each_slice(1000) { |ids| FCM.new(Rails.application.credentials.dig(:fcm_key)).send(ids, options)}
    end
  end

end
