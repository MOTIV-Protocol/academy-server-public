# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_06_16_082440) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_admin_comments", force: :cascade do |t|
    t.string "namespace"
    t.text "body"
    t.string "resource_type"
    t.bigint "resource_id"
    t.string "author_type"
    t.bigint "author_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["author_type", "author_id"], name: "index_active_admin_comments_on_author_type_and_author_id"
    t.index ["namespace"], name: "index_active_admin_comments_on_namespace"
    t.index ["resource_type", "resource_id"], name: "index_active_admin_comments_on_resource_type_and_resource_id"
  end

  create_table "admin_users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["email"], name: "index_admin_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_admin_users_on_reset_password_token", unique: true
  end

  create_table "attendances", force: :cascade do |t|
    t.datetime "attended_at"
    t.bigint "lecture_id", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "status", limit: 2, default: 0
    t.index ["lecture_id"], name: "index_attendances_on_lecture_id"
    t.index ["user_id"], name: "index_attendances_on_user_id"
  end

  create_table "calculate_histories", force: :cascade do |t|
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "name", null: false
    t.integer "order_count", default: 0, null: false
    t.integer "profit", default: 0, null: false
    t.integer "status", limit: 2, default: 0, null: false
  end

  create_table "categories", force: :cascade do |t|
    t.string "title"
    t.text "body"
    t.integer "position"
    t.string "image"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "ancestry"
    t.index ["ancestry"], name: "index_categories_on_ancestry"
  end

  create_table "comments", force: :cascade do |t|
    t.text "body"
    t.string "target_type"
    t.bigint "target_id"
    t.bigint "user_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["target_type", "target_id"], name: "index_comments_on_target_type_and_target_id"
    t.index ["user_id"], name: "index_comments_on_user_id"
  end

  create_table "contacts", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.string "phone"
    t.string "title"
    t.text "content"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "user_id", null: false
    t.index ["user_id"], name: "index_contacts_on_user_id"
  end

  create_table "coupons", force: :cascade do |t|
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "name", null: false
    t.integer "discount_price", default: 0, null: false
    t.integer "minimum_order_price", default: 0, null: false
    t.datetime "expires_at"
    t.string "content"
    t.string "coupon_number"
  end

  create_table "events", force: :cascade do |t|
    t.string "title"
    t.string "content"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "image"
    t.datetime "start_at"
    t.datetime "end_at"
    t.integer "event_type", limit: 2, default: 0
  end

  create_table "faqs", force: :cascade do |t|
    t.string "title"
    t.text "content"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "classification"
  end

  create_table "images", force: :cascade do |t|
    t.string "imagable_type"
    t.bigint "imagable_id"
    t.string "image"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["imagable_type", "imagable_id"], name: "index_images_on_imagable_type_and_imagable_id"
  end

  create_table "impressions", force: :cascade do |t|
    t.string "impressionable_type"
    t.integer "impressionable_id"
    t.integer "user_id"
    t.string "controller_name"
    t.string "action_name"
    t.string "view_name"
    t.string "request_hash"
    t.string "ip_address"
    t.string "session_hash"
    t.text "message"
    t.text "referrer"
    t.text "params"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["controller_name", "action_name", "ip_address"], name: "controlleraction_ip_index"
    t.index ["controller_name", "action_name", "request_hash"], name: "controlleraction_request_index"
    t.index ["controller_name", "action_name", "session_hash"], name: "controlleraction_session_index"
    t.index ["impressionable_type", "impressionable_id", "ip_address"], name: "poly_ip_index"
    t.index ["impressionable_type", "impressionable_id", "params"], name: "poly_params_request_index"
    t.index ["impressionable_type", "impressionable_id", "request_hash"], name: "poly_request_index"
    t.index ["impressionable_type", "impressionable_id", "session_hash"], name: "poly_session_index"
    t.index ["impressionable_type", "message", "impressionable_id"], name: "impressionable_type_message_index"
    t.index ["user_id"], name: "index_impressions_on_user_id"
  end

  create_table "lectures", force: :cascade do |t|
    t.string "title"
    t.integer "price"
    t.bigint "category_id"
    t.text "description"
    t.bigint "user_id"
    t.integer "status", default: 0
    t.decimal "reviews_average", default: "0.0"
    t.integer "reviews_count"
    t.datetime "start_at"
    t.datetime "end_at"
    t.decimal "lat", precision: 15, scale: 10
    t.decimal "lng", precision: 15, scale: 10
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "school_id"
    t.integer "capacity"
    t.bigint "teacher_id"
    t.index ["category_id"], name: "index_lectures_on_category_id"
    t.index ["school_id"], name: "index_lectures_on_school_id"
    t.index ["teacher_id"], name: "index_lectures_on_teacher_id"
    t.index ["user_id"], name: "index_lectures_on_user_id"
  end

  create_table "lectures_users", id: false, force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "lecture_id", null: false
    t.index ["lecture_id", "user_id"], name: "index_lectures_users_on_lecture_id_and_user_id"
    t.index ["user_id", "lecture_id"], name: "index_lectures_users_on_user_id_and_lecture_id"
  end

  create_table "likes", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "school_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["school_id"], name: "index_likes_on_school_id"
    t.index ["user_id"], name: "index_likes_on_user_id"
  end

  create_table "line_items", force: :cascade do |t|
    t.integer "price"
    t.integer "amount", default: 1
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "lecture_id"
    t.bigint "order_id", null: false
    t.index ["lecture_id"], name: "index_line_items_on_lecture_id"
    t.index ["order_id"], name: "index_line_items_on_order_id"
  end

  create_table "notices", force: :cascade do |t|
    t.string "title"
    t.text "body"
    t.integer "view_count", default: 0
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "orders", force: :cascade do |t|
    t.integer "pay_method"
    t.string "say_to_teacher"
    t.string "say_to_owner"
    t.integer "status", default: 0
    t.bigint "user_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.datetime "completed_at"
    t.string "order_number"
    t.integer "payment_total"
    t.string "payment_key"
    t.integer "calculate_history_id"
    t.integer "amount"
    t.integer "used_point"
    t.string "buyer_tel"
    t.bigint "school_id"
    t.index ["school_id"], name: "index_orders_on_school_id"
    t.index ["user_id"], name: "index_orders_on_user_id"
  end

  create_table "phone_certifications", force: :cascade do |t|
    t.string "phone"
    t.string "code"
    t.datetime "confirmed_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "point_histories", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.integer "amount"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "status", default: 0
    t.bigint "order_id"
    t.index ["order_id"], name: "index_point_histories_on_order_id"
    t.index ["user_id"], name: "index_point_histories_on_user_id"
  end

  create_table "reviews", force: :cascade do |t|
    t.decimal "score"
    t.text "content"
    t.bigint "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "order_id"
    t.index ["order_id"], name: "index_reviews_on_order_id"
    t.index ["user_id"], name: "index_reviews_on_user_id"
  end

  create_table "schools", force: :cascade do |t|
    t.string "name"
    t.string "location"
    t.text "introduce"
    t.text "location_info"
    t.string "business_number"
    t.string "business_owner"
    t.string "business_brand"
    t.string "business_address"
    t.text "opening_time"
    t.string "phone"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "owner_id"
    t.integer "order_count", default: 0
    t.decimal "average_score", default: "0.0"
    t.integer "like_count", default: 0
    t.integer "review_count", default: 0
    t.integer "comment_count", default: 0
    t.decimal "lat", precision: 15, scale: 10
    t.decimal "lng", precision: 15, scale: 10
    t.index ["owner_id"], name: "index_schools_on_owner_id"
  end

  create_table "user_coupons", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "coupon_id", null: false
    t.bigint "order_id"
    t.datetime "used_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "status", default: 0
    t.index ["coupon_id"], name: "index_user_coupons_on_coupon_id"
    t.index ["order_id"], name: "index_user_coupons_on_order_id"
    t.index ["user_id"], name: "index_user_coupons_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet "current_sign_in_ip"
    t.inet "last_sign_in_ip"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.string "name", default: ""
    t.string "phone"
    t.string "image"
    t.string "address1"
    t.string "address2"
    t.string "zipcode"
    t.integer "gender", limit: 2, default: 0
    t.integer "status", limit: 2, default: 0
    t.boolean "accept_sms"
    t.boolean "accept_email"
    t.decimal "lat", precision: 15, scale: 10
    t.decimal "lng", precision: 15, scale: 10
    t.integer "point", default: 0
    t.decimal "reviews_average", default: "0.0"
    t.integer "reviews_count"
    t.string "device_token"
    t.string "device_type"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "role", limit: 2, default: 0
    t.bigint "school_id"
    t.string "bank"
    t.string "bank_account"
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["school_id"], name: "index_users_on_school_id"
  end

  add_foreign_key "attendances", "lectures"
  add_foreign_key "attendances", "users"
  add_foreign_key "comments", "users"
  add_foreign_key "contacts", "users", on_delete: :cascade
  add_foreign_key "likes", "schools"
  add_foreign_key "likes", "users"
  add_foreign_key "line_items", "lectures", on_delete: :cascade
  add_foreign_key "line_items", "orders", on_delete: :cascade
  add_foreign_key "orders", "schools", on_delete: :cascade
  add_foreign_key "orders", "users"
  add_foreign_key "point_histories", "orders", on_delete: :cascade
  add_foreign_key "point_histories", "users"
  add_foreign_key "reviews", "orders", on_delete: :cascade
  add_foreign_key "reviews", "users"
  add_foreign_key "user_coupons", "coupons"
  add_foreign_key "user_coupons", "orders"
  add_foreign_key "user_coupons", "users"
end
