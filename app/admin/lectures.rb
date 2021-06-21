ActiveAdmin.register Lecture do
  menu label: "#{I18n.t("activerecord.models.lecture")}"

  scope -> { '전체' }, :all

  controller do
    def scoped_collection
      Lecture.includes(:school)
      Lecture.includes(:teacher)
    end
  end

  filter :title_cont, label: "#{I18n.t("activerecord.attributes.lecture.title")} 검색"
  filter :price, label: "#{I18n.t("activerecord.attributes.lecture.price")} 검색"
  filter :category, label: "#{I18n.t("activerecord.attributes.lecture.category")} 필터"
  filter :school_name_eq, label: "#{I18n.t("activerecord.attributes.lecture.school")} 검색"
  filter :teacher_name_eq, label: "#{I18n.t("activerecord.attributes.lecture.teacher")} 검색"

  index do
    selectable_column
    id_column
    br
    a link_to ("10 개씩 보기"), "/admin/lectures?order=id_desc&per_page=10", class: "button small"
    a link_to ("30 개씩 보기"), "/admin/lectures?order=id_desc&per_page=30", class: "button small"
    a link_to ("50 개씩 보기"), "/admin/lectures?order=id_desc&per_page=50", class: "button small"
    a link_to ("모두 보기"), "/admin/lectures?order=id_desc&per_page=#{Lecture.count}", class: "button small"
    column :title  
    column :price do |lecture| "#{lecture.price}원" end
    column :category  
    # column :image do |lectures| image_tag(lectures.image_path ,class: 'admin-index-image') end
    column :school  
    column :teacher
    actions
  end

  show do
    attributes_table do
      row :id
      row :title  
      row :price do |lecture| "#{lecture.price}원" end
      row :category  
      row :description  
      row :start_at  
      row :end_at
      row :created_at  
      row :updated_at  
      row :school  
      row :teacher
      panel '이미지 리스트' do
        table_for '이미지' do
          lecture.images.each_with_index do |image, index|
            column "이미지#{index}" do
              image_tag(image.image_path ,class: 'admin-show-image')
            end
          end
        end
      end
    end
  end

  form do |f|
    f.inputs do
      f.input :title  
      f.input :price
      f.input :category  
      f.input :description
      f.input :school  
      f.input :teacher  
      f.input :start_at, as: :datepicker 
      f.input :end_at, as: :datepicker 
      f.has_many :images do |p|
        p.inputs '사진업로드' do
          p.input :image
        end
      end
    end
    f.actions
  end
end
