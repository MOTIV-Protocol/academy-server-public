ActiveAdmin.register <%= model_name %> do
  menu label: "#{I18n.t("activerecord.models.<%= name %>")}"
  <% if refined_columns.include?(:position) -%>
# config.sort_order = 'position_asc'
#   config.paginate   = false
  <% end -%>

  controller do
    def scoped_collection
      <% if likable? && commentable? %>
      <%= model_constant %>.includes(:received_likes, :received_comments)
      <% elsif likable? %>
      <%= model_constant %>.includes(:received_likes)
      <% elsif commentable? %>
      <%= model_constant %>.includes(:received_comments)
      <% else %>
      super
      <% end %>
    end
  end

  scope -> { '전체' }, :all
  <% defined_enum_hash.keys.each do |enum_attr| -%>
  <% enum_hash = I18n.t("enum.#{name}") -%>
  <% if !enum_hash.include?('translation missing') %>
  <% real_enum_hash = I18n.t("enum.#{name}.#{enum_attr}") -%>
  <% if !real_enum_hash.include?('translation missing') %>
  I18n.t("enum.<%= name %>.<%= enum_attr %>").keys.each do |state|
    scope -> { I18n.t("enum.<%= name %>.<%= enum_attr %>.#{state}") }, state
  end
  <% end -%>
  <% end -%>
  <% end -%>

  <% if defined_enum_hash.present? -%>
  <% defined_enum_hash.keys.each do |enum_attr| -%>
  <% if !I18n.t("enum.#{name}").include?('translation missing') && !I18n.t("enum.#{name}.#{enum_attr}").include?('translation missing') %>
  batch_action "#{I18n.t("activerecord.attributes.<%= name %>.<%= enum_attr %>")} 변경", form: {
    <%= enum_attr %>: I18n.t("enum.<%= name %>.<%= enum_attr %>").keys
  }, confirm: '정말 해당 작업을 진행하시겠습니까?' do |ids, inputs|
    <%= name.pluralize %> = <%= model_name %>.find(ids)
    <%= name.pluralize %>.each do |<%= name %>|
      <%= name %>.update(<%= enum_attr %>: inputs[:<%= enum_attr %>])
    end
    flash[:notice] = '해당 리스트들의 변경을 성공적으로 완료했습니다.'
    redirect_back(fallback_location: collection_path)
  end
  <% else -%>
  # 해당 테이블 enum 들의 ko.yml을 모두 작성해주세요 :)
  <% end -%>
  <% end -%>
  <% else %>
  ## 여러개의 레코드 선택하여 실행하는 배치액션 만들 때
  # batch_action '배치액션 명', confirm: '정말 해당 배치액션을 실행하시겠습니까?', form: {
  #   field_name: selectors
  # } do |ids, inputs|
  #   <%= name.pluralize %> = <%= model_name %>.find(ids)
  #   <%= name.pluralize %>.each do |<%= name %>|
  #     # CODE # inputs[:field_name]
  #   end
  #   flash[:notice] = '해당 리스트들의 배치액션을 성공적으로 완료했습니다.'
  #   redirect_back(fallback_location: collection_path)
  # end
  <% end -%>

  ## index 페이지에 버튼 생성할 때
  # action_item '버튼 명', only: :index do
  #   link_to '버튼 명', '#' #'url'
  # end

  ## 새로운 주소 규칙을 만들 때 (view파일을 써야 할 경우 views/admin 경로에 만드시면 됩니다.)
  # collection_action :new_url, method: :post

<% attributes.each do |attr| -%>
<% if !attr.name.include?('password') && !attr.name.include?('token') -%>
<% if attr.name.include?('_id') -%>
  filter :<%= attr.name.sub("_id", "") -%>, label: "#{I18n.t("activerecord.attributes.<%= name %>.<%= attr.name.sub("_id", "") %>")} 필터"
<% elsif attr.type == :boolean -%>
  filter :<%= attr.name -%>, label: "#{I18n.t("activerecord.attributes.<%= name %>.<%= attr.name %>")} 필터"
<% elsif attr.type == :string && !attr.name.include?('image') && !attr.name.include?('img') && !attr.name.include?('thumbnail') -%>
  filter :<%= attr.name -%>_cont, label: "#{I18n.t("activerecord.attributes.<%= name %>.<%= attr.name %>")} 필터"
<% elsif (attr.type == :integer || attr.type == :decimal) && attr.name != 'position' -%>
  filter :<%= attr.name -%>_eq, label: "#{I18n.t("activerecord.attributes.<%= name %>.<%= attr.name %>")} 필터"
<% end -%>
<% end -%>
<% end -%>

  <% if refined_columns.include?(:position) -%>
# reorderable

#   index as: :reorderable_table do
  <% else -%>
index do
    selectable_column
  <% end -%>
  id_column
    br
    a link_to ("10 개씩 보기"), "/admin/<%= name.pluralize %>?order=id_desc&per_page=10", class: "button small"
    a link_to ("30 개씩 보기"), "/admin/<%= name.pluralize %>?order=id_desc&per_page=30", class: "button small"
    a link_to ("50 개씩 보기"), "/admin/<%= name.pluralize %>?order=id_desc&per_page=50", class: "button small"
    a link_to ("모두 보기"), "/admin/<%= name.pluralize %>?order=id_desc&per_page=#{<%= model_constant %>.count}", class: "button small"
<% attributes.each do |attr| %>
  <% if attr.name.include?('_id') -%>
  column :<%= attr.name.sub('_id', '') -%>
  <% elsif model_enums.keys.include?(attr.name) -%>
  tag_column :<%= attr.name -%>, interactive: true
  <% elsif attr.name.include?('image') || attr.name.include?('img') || attr.name.include?('thumbnail') -%>
  <% if image_url? -%>
column :<%= attr.name -%> do |<%= name -%>| image_tag(<%= name -%>.image_path ,class: 'admin-index-image') end
  <% else -%>
column :<%= attr.name -%> do |<%= name -%>| image_tag(<%= name -%>.<%= attr.name -%>.url ,class: 'admin-index-image') end
  <% end -%>
  <% elsif (attr.type == :integer || attr.type == :decimal) && attr.name != 'position' -%>
  <% if attr.name.include?('price') || attr.name.include?('fee') -%>
column :<%= attr.name -%> do |<%= name -%>| number_to_currency(<%= name -%>.<%= attr.name -%>, unit: '원') end
  <% elsif attr.name.include?('count') || attr.name.include?('cnt') || attr.name.include?('num') || attr.name.include?('number') -%>
column :<%= attr.name -%> do |<%= name -%>| number_to_currency(<%= name -%>.<%= attr.name -%>, unit: '개') end
  <% else -%>
column :<%= attr.name -%> do |<%= name -%>| number_to_currency(<%= name -%>.<%= attr.name -%>, unit: '') end
  <% end -%>
  <% elsif attr.name.include?('url') -%>
  column :<%= attr.name -%> do |<%= name -%>| link_to '보러가기', <%= name -%>.<%= attr.name -%>, target: :_blank end
  <% elsif attr.type != :text && !attr.name.include?('password') && !attr.name.include?('token') -%>
  column :<%= attr.name -%>
  <% end -%>
<% end %>
    <% if commentable? %>
    column '댓글 개수' do |<%= name %>| number_to_currency(<%= name %>.received_comments.size, unit: '개') end
    <% end %>
    <% if likable? %>
    column '좋아요 수' do |<%= name %>| number_to_currency(<%= name %>.received_likes.size, unit: '개') end
    <% end %>
    actions
  end

  show do
    attributes_table do
      row :id
<% attributes.each do |attr| %>
  <% if attr.name.include?('_id') -%>
    row :<%= attr.name.sub('_id', '') -%>
  <% elsif model_enums.keys.include?(attr.name) -%>
    tag_row :<%= attr.name -%>, interactive: true
  <% elsif attr.name.include?('image') || attr.name.include?('img') || attr.name.include?('thumbnail') -%>
  <% if image_url? -%>
  row :<%= attr.name -%> do |<%= name -%>| image_tag(<%= name -%>.image_path ,class: 'admin-show-image') end
  <% else -%>
  row :<%= attr.name -%> do |<%= name -%>| image_tag(<%= name -%>.<%= attr.name -%>.url ,class: 'admin-show-image') end
  <% end -%>
  <% elsif (attr.type == :integer || attr.type == :decimal) && attr.name != 'position' -%>
  <% if attr.name.include?('price') || attr.name.include?('fee') -%>
  row :<%= attr.name -%> do |<%= name -%>| number_to_currency(<%= name -%>.<%= attr.name -%>, unit: '원') end
  <% elsif attr.name.include?('count') || attr.name.include?('cnt') || attr.name.include?('num') || attr.name.include?('number') -%>
  row :<%= attr.name -%> do |<%= name -%>| number_to_currency(<%= name -%>.<%= attr.name -%>, unit: '개') end
  <% else -%>
  row :<%= attr.name -%> do |<%= name -%>| number_to_currency(<%= name -%>.<%= attr.name -%>, unit: '') end
  <% end -%>
  <% elsif attr.name.include?('url') -%>
    row :<%= attr.name -%> do |<%= name -%>| link_to '보러가기', <%= name -%>.<%= attr.name -%>, target: :_blank end
  <% else -%>
    row :<%= attr.name -%>
  <% end -%>
<% end %>
    <% if commentable? %>
      row '댓글 개수' do |<%= name %>| number_to_currency(<%= name %>.received_comments.size, unit: '개') end
    <% end %>
    <% if likable? %>
      row '좋아요 수' do |<%= name %>| number_to_currency(<%= name %>.received_likes.size, unit: '개') end
    <% end %>
    <% if imagable? -%>
  panel '이미지 리스트' do
        table_for '이미지' do
          <%= name %>.images.each_with_index do |image, index|
            column "이미지#{index}" do
              image_tag(image.image_path ,class: 'admin-show-image')
            end
          end
        end
      end
    <% end -%>
end
  end

  form do |f|
    f.inputs do
<% attributes.each do |attr| %>
  <% if attr.name.include?('_id') -%>
    f.input :<%= attr.name.sub('_id', '') -%>
  <% elsif model_enums.keys.include?(attr.name) -%>
    f.input :<%= attr.name -%>, as: :select, collection: <%= model_name -%>.enum_selectors(:<%= attr.name -%>)
  <% elsif attr.name != 'created_at' and attr.name != 'updated_at' -%>
    f.input :<%= attr.name -%>
  <% elsif attr.name.include?('passowrd') -%>
    f.input :<%= attr.name -%> if f.object.new_record?
  <% end -%>
<% end %>
    <% if imagable? %>
      f.has_many :images do |p|
        p.inputs '사진업로드' do
          p.input :image
        end
      end
    <% end %>
    end
    f.actions
  end
end
