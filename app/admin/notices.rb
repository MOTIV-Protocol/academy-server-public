ActiveAdmin.register Notice do
  menu label: "#{I18n.t("activerecord.models.notice")}"
  config.sort_order = 'position_asc'
  config.paginate   = false
  
  controller do
    def scoped_collection
      super
    end
  end

  scope -> { '전체' }, :all

  filter :title_cont, label: "#{I18n.t("activerecord.attributes.notices.title")} 필터"
  filter :view_count_eq, label: "#{I18n.t("activerecord.attributes.notices.view_count")} 필터"

  index do
    id_column
    br
    a link_to ("10 개씩 보기"), "/admin/notices?order=id_desc&per_page=10", class: "button small"
    a link_to ("30 개씩 보기"), "/admin/notices?order=id_desc&per_page=30", class: "button small"
    a link_to ("50 개씩 보기"), "/admin/notices?order=id_desc&per_page=50", class: "button small"
    a link_to ("모두 보기"), "/admin/notices?order=id_desc&per_page=#{Notice.count}", class: "button small"
    column :title  
    column :position  
    column :view_count do |notices| number_to_currency(notices.view_count, unit: '개') end
    column :created_at  
    column :updated_at  
    actions
  end

  show do
    attributes_table do
      row :id
      row :title  
      row :body  
      row :position  
      row :view_count do |notices| number_to_currency(notices.view_count, unit: '개') end
      row :created_at  
      row :updated_at  
    end
  end

  form do |f|
    f.inputs do
      f.input :title  
      f.input :body  
      f.input :position  
      f.input :view_count  
    end
    f.actions
  end
end
