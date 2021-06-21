ActiveAdmin.register User do
  menu label: "#{I18n.t("activerecord.models.user")}"
  
  controller do
    def scoped_collection
      super
    end
  end

  batch_action "푸시메시지 전송", form: {
    body: :text
  }, confirm: '정말 해당 작업을 진행하시겠습니까?' do |ids, inputs| 
    device_tokens = User.where(id: ids).pluck(:device_token)
    body = inputs.dig('body')
    MultipleFcmJob.perform(body, device_tokens)

    redirect_to admin_users_path, notice: "테스트 메시지를 발송했습니다"
  end

  scope -> { '전체' }, :all
  scope -> { '학생' }, :student
  scope -> { '선생님' }, :teacher
  scope -> { '원장님' }, :owner

  filter :email_cont, label: "#{I18n.t("activerecord.attributes.user.email")} 검색"
  filter :name_cont, label: "#{I18n.t("activerecord.attributes.user.name")} 검색"
  filter :gender, label: "#{I18n.t("activerecord.attributes.user.gender")} 필터", as: :select, collection: I18n.t("enum.user.gender").invert.to_a
  filter :point, label: "#{I18n.t("activerecord.attributes.user.point")} 필터"
  filter :reviews_average, label: "#{I18n.t("activerecord.attributes.user.reviews_average")} 필터"
  filter :reviews_count, label: "#{I18n.t("activerecord.attributes.user.reviews_count")} 필터"
  filter :phone_cont, label: "#{I18n.t("activerecord.attributes.user.phone")} 검색"
  filter :address1_cont, label: "#{I18n.t("activerecord.attributes.user.address1")} 검색"
  filter :address2_cont, label: "#{I18n.t("activerecord.attributes.user.address2")} 검색"
  filter :zipcode_cont, label: "#{I18n.t("activerecord.attributes.user.zipcode")} 검색"

  index do
    selectable_column
    id_column
    br
    a link_to ("10 개씩 보기"), "/admin/users?order=id_desc&per_page=10", class: "button small"
    a link_to ("30 개씩 보기"), "/admin/users?order=id_desc&per_page=30", class: "button small"
    a link_to ("50 개씩 보기"), "/admin/users?order=id_desc&per_page=50", class: "button small"
    a link_to ("모두 보기"), "/admin/users?order=id_desc&per_page=#{User.count}", class: "button small"
    column :email  
    column :name  
    column :phone  
    column :address1  
    column :address2  
    column :gender do |users| I18n.t("enum.user.gender.#{users.gender}") end
    column :role do |users| I18n.t("enum.user.role.#{users.role}") end
    actions
  end

  show do
    attributes_table do
      row :id
      row :email  
      row :name  
      row :phone  
      row :gender do |users| I18n.t("enum.user.gender.#{users.gender}") end
      row :role do |users| I18n.t("enum.user.role.#{users.role}") end
      row :image do |users| image_tag(users.image_path ,class: 'admin-show-image') end
      row :address1  
      row :address2  
      row :zipcode
      row :created_at  
      row :updated_at  
    end
  end

  form do |f|
    f.inputs do
      f.input :email  
      f.input :password
      f.input :name  
      f.input :phone  
      f.input :image  
      f.input :address1  
      f.input :address2  
      f.input :zipcode  
      f.input :gender, as: :select, collection: I18n.t("enum.user.gender").invert.to_a
    end
    f.actions
  end
end
