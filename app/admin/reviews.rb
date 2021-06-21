ActiveAdmin.register Review do
  menu label: "#{I18n.t("activerecord.models.review")}"

  controller do
    def scoped_collection
      Review.includes(:comment)
      Review.includes(:order)
      Review.includes(:user)
    end
  end

  scope -> { '전체' }, :all
  
  filter :content_cont, label: "#{I18n.t("activerecord.attributes.review.content")} 필터"
  filter :score_eq, label: "#{I18n.t("activerecord.attributes.review.score")} 필터"
  filter :user_name_eq, label: "#{I18n.t("activerecord.attributes.review.user")} 필터"

  index do
    selectable_column
    id_column
    br
    a link_to ("10 개씩 보기"), "/admin/reviews?order=id_desc&per_page=10", class: "button small"
    a link_to ("30 개씩 보기"), "/admin/reviews?order=id_desc&per_page=30", class: "button small"
    a link_to ("50 개씩 보기"), "/admin/reviews?order=id_desc&per_page=50", class: "button small"
    a link_to ("모두 보기"), "/admin/reviews?order=id_desc&per_page=#{Review.count}", class: "button small"
    column :score do |review| number_to_currency(review.score, unit: '') end
    column :user
    column :content
    column :school do |review| review.order.school end
    column :created_at  
    actions
  end

  show do
    attributes_table do
      row :id
      row :user
      row :score do |reviews| number_to_currency(reviews.score, unit: '') end
      row :content  
      row :school do |review| review.order.school end
      row :created_at  
      row :updated_at  
      panel '이미지 리스트' do
        table_for '이미지' do
          review.images.each_with_index do |image, index|
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
      f.input :score  
      f.input :content
      f.input :user  
      f.has_many :images do |p|
        p.inputs '사진업로드' do
          p.input :image
        end
      end    
    end
    f.actions
  end
end
