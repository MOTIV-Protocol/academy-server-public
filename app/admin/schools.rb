ActiveAdmin.register School do
  menu label: "#{I18n.t("activerecord.models.school")}"

  controller do
    def scoped_collection
      super
    end
  end

  scope -> { '전체' }, :all

  filter :name_cont, label: "#{I18n.t("activerecord.attributes.school.name")} 검색"
  filter :location_cont, label: "#{I18n.t("activerecord.attributes.school.location")} 검색"
  filter :business_number_cont, label: "#{I18n.t("activerecord.attributes.school.business_number")} 검색"
  filter :business_owner_cont, label: "#{I18n.t("activerecord.attributes.school.business_owner")} 검색"
  filter :business_brand_cont, label: "#{I18n.t("activerecord.attributes.school.business_brand")} 검색"
  filter :business_address_cont, label: "#{I18n.t("activerecord.attributes.school.business_address")} 검색"
  filter :phone_cont, label: "#{I18n.t("activerecord.attributes.school.phone")} 검색"
  filter :review_count, label: "#{I18n.t("activerecord.attributes.school.review_count")} 필터"
  filter :like_count, label: "#{I18n.t("activerecord.attributes.school.like_count")} 필터"
  filter :average_score, label: "#{I18n.t("activerecord.attributes.school.average_score")} 필터"
  filter :comment_count, label: "#{I18n.t("activerecord.attributes.school.comment_count")} 필터"

  index do
    selectable_column
    id_column
    br
    a link_to ("10 개씩 보기"), "/admin/schools?order=id_desc&per_page=10", class: "button small"
    a link_to ("30 개씩 보기"), "/admin/schools?order=id_desc&per_page=30", class: "button small"
    a link_to ("50 개씩 보기"), "/admin/schools?order=id_desc&per_page=50", class: "button small"
    a link_to ("모두 보기"), "/admin/schools?order=id_desc&per_page=#{School.count}", class: "button small"
    column :name
    column :owner
    column :order_count
    column :like_count
    column :review_count
    column :average_score do |school| school.average_score.floor(1) end
    column :comment_count
    column :phone
    actions
  end

  show do
    attributes_table do
      row :id
      row "지도 위치" do |p|
        render partial: "map", locals: {school: school}
      end
      row :name
      row :owner
      row :location  
      row :introduce  
      row :location_info  
      row :business_number  
      row :business_owner  
      row :business_brand  
      row :business_address  
      row :opening_time  
      row :phone  
      row :created_at  
      row :updated_at  
      row :order_count
      row :like_count
      row :review_count
      row :average_score do |school| school.average_score.floor(1) end
      row :comment_count
      panel '이미지 리스트' do
        table_for '이미지' do
          school.images.each_with_index do |image, index|
            column "이미지#{index}" do
              image_tag(image.image_path, class: 'admin-show-image')
            end
          end
        end
      end
    end
  end

  form do |f|
    panel '학원정보', class: "school-panel" do
      f.inputs do
        panel '위치 설정' do
          render partial: "map", locals: {school: school, form: true}
        end
        f.input :name  
        f.input :location  
        f.input :introduce  
        f.input :location_info  
        f.input :business_number  
        f.input :business_owner  
        f.input :business_brand  
        f.input :business_address  
        f.input :opening_time  
        f.input :phone  
        f.has_many :images do |p|
          p.inputs '사진업로드' do
            p.input :image
          end
        end
      end
    end

    if f.object.new_record?
      panel "원장님 정보", class: "owner-panel" do
        f.inputs for: "owner_attributes" do |t|
          t.input :email, label: I18n.t("activerecord.attributes.user.email")  
          t.input :password, label: I18n.t("activerecord.attributes.user.password")
          t.input :name, label: I18n.t("activerecord.attributes.user.name")  
          t.input :phone, label: I18n.t("activerecord.attributes.user.phone")
          t.input :image, as: :file, label: I18n.t("activerecord.attributes.user.image")
          t.input :address1, label: I18n.t("activerecord.attributes.user.address1")  
          t.input :address2, label: I18n.t("activerecord.attributes.user.address2")  
          t.input :zipcode, label: I18n.t("activerecord.attributes.user.zipcode")  
          t.input :gender, as: :select, collection: I18n.t("enum.user.gender").invert.to_a, label: I18n.t("activerecord.attributes.user.gender")
          t.input :role, input_html: { value: :owner }, as: :hidden
        end
      end
    end

    f.actions
  end
end
