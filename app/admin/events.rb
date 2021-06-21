ActiveAdmin.register Event do
  menu label: "#{I18n.t("activerecord.models.event")}"

  scope -> { '전체' }, :all
  scope -> { '상단배너' }, :banner
  scope -> { '인앱노출' }, :in_page

  filter :title_cont, label: "#{I18n.t("activerecord.attributes.event.title")} 검색"
  filter :content_cont, label: "#{I18n.t("activerecord.attributes.event.content")} 검색"
  filter :event_type_eq, as: :select, collection: [['배너', 'banner'], ['인앱노출', 'in_page']], label: "#{I18n.t("activerecord.attributes.event.content")} 검색"

  collection_action :summernote, method: :get do
    @event = Event.find_or_initialize_by(id: params[:event_id])
    render layout: false
  end

  index do
    id_column
    br
    a link_to ("10 개씩 보기"), "/admin/event?order=id_desc&per_page=10", class: "button small"
    a link_to ("30 개씩 보기"), "/admin/event?order=id_desc&per_page=30", class: "button small"
    a link_to ("50 개씩 보기"), "/admin/event?order=id_desc&per_page=50", class: "button small"
    a link_to ("모두 보기"), "/admin/event?order=id_desc&per_page=#{Event.count}", class: "button small"
    column :image do |category|
      image_tag(category.image_path, class: 'admin-index-image', style: "max-width: 125px;")
    end
    column :title  
    column :start_at
    column :end_at 
    column :event_type
    actions
  end

  show do
    attributes_table do
      row :id
      row :image do |category|
        image_tag(category.image_path, class: 'admin-index-image', style: "max-width: 125px;")
      end
      row :title  
      row :start_at
      row :end_at 
      row :event_type
      row :created_at  
      row :updated_at  
      row(:content) { |event| raw(event.content) }
    end
  end

  form do |f|
    f.object.start_at ||= DateTime.now
    f.object.end_at ||= DateTime.now + 14.days
    f.inputs do
      f.input :image
      f.input :title  
      f.input :event_type, as: :select, collection: I18n.t("enum.event.event_type").invert.to_a
      f.input :start_at
      f.input :end_at 
      f.input :content, input_html: {style: "display: none;"}, label: false
      render 'admin/events/iframe'
    end
    f.actions
  end
end
