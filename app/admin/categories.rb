ActiveAdmin.register Category do
  menu label: "#{I18n.t("activerecord.models.category")}"

  controller do
    def scoped_collection
      super
    end
  end

  scope -> { '전체' }, :all
  scope "서브 카테고리", :sub do |scope| scope.ransack(ancestry_not_null: true).result end
  scope "메인 카테고리", :main do |scope| scope.ransack(ancestry_null: true).result end

  filter :title_cont, label: "#{I18n.t("activerecord.attributes.category.title")} 필터"

  index do
    id_column
    br
    a link_to ("10 개씩 보기"), "/admin/categories?order=id_desc&per_page=10", class: "button small"
    a link_to ("30 개씩 보기"), "/admin/categories?order=id_desc&per_page=30", class: "button small"
    a link_to ("50 개씩 보기"), "/admin/categories?order=id_desc&per_page=50", class: "button small"
    a link_to ("모두 보기"), "/admin/categories?order=id_desc&per_page=#{Category.count}", class: "button small"
    column :title  
    column :position do |category| category.is_root? ? category.position : nil end
    column :image do |category|
      image_tag(category.image_path, class: 'admin-index-image', style: "max-width: 25px;")
    end
    column '상위 카테고리' do |category| category.parent end  
    actions
  end

  show do
    attributes_table do
      row :id
      row :title  
      row :body  
      row :position  
      row :image do |categories| image_tag(categories.image_path ,class: 'admin-show-image') end
      row :created_at  
      row :updated_at  
      row :ancestry  
    end
  end

  form do |f|
    f.inputs do
      f.input :title  
      f.input :body  
      f.input :position  
      f.input :image  
      f.input :ancestry  
    end
    f.actions
  end
end
