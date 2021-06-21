ActiveAdmin.register Order do
  config.clear_action_items!
  
  menu label: "#{I18n.t("activerecord.models.order")}"
  
  controller do
    def scoped_collection
      super
      Order.includes(:users)
      Order.includes(:line_items)
    end
  end

  scope -> { '전체' }, :all
  scope -> { '완료된 주문' }, :complete
  scope -> { '취소된 주문' }, :canceled

  filter :payment_total, label: "#{I18n.t("activerecord.attributes.order.payment_total")} 필터"
  filter :pay_method, label: "#{I18n.t("activerecord.attributes.order.pay_method")} 필터", as: :select, collection: I18n.t("enum.order.pay_method").invert.to_a
  filter :status, label: "#{I18n.t("activerecord.attributes.order.status")} 필터", as: :select, collection: I18n.t("enum.order.status").invert.to_a
  filter :user_name_cont, label: "#{I18n.t("activerecord.attributes.order.user_name")} 검색"

  index do
    selectable_column
    id_column
    br
    a link_to ("10 개씩 보기"), "/admin/orders?order=id_desc&per_page=10", class: "button small"
    a link_to ("30 개씩 보기"), "/admin/orders?order=id_desc&per_page=30", class: "button small"
    a link_to ("50 개씩 보기"), "/admin/orders?order=id_desc&per_page=50", class: "button small"
    a link_to ("모두 보기"), "/admin/orders?order=id_desc&per_page=#{CalculateHistory.count}", class: "button small"
    column :user
    column :pay_method do |order| I18n.t("enum.order.pay_method.#{order.pay_method}") end
    column :status do |order| I18n.t("enum.order.status.#{order.status}") end
    column :completed_at
    column :order_number
    column :payment_total
    column :school
    actions
  end

  show do
    panel '결제정보' do
      attributes_table_for resource do
        row :id
        row :pay_method do |order| I18n.t("enum.order.pay_method.#{order.pay_method}") end
        row :say_to_teacher
        row :say_to_owner
        row :user
        row :completed_at
        row :status do |order| I18n.t("enum.order.status.#{order.status}") end
        row :order_number
        row :payment_total
        row :school
        row :calculate_history
        row :created_at
        row :updated_at
      end
    end
    panel '결제 항목' do
      table_for order.line_items do
        column :lecture
        column :price
        column :amount
      end
    end
  end

  form do |f|
    f.inputs do
      f.input :pay_method, collection: I18n.t("enum.order.pay_method").invert.to_a
      f.input :say_to_teacher
      f.input :say_to_owner
      f.input :user
      f.input :completed_at
      f.input :status, collection: I18n.t("enum.order.status").invert.to_a
      f.input :order_number
      f.input :payment_total
      f.input :calculate_history
    end
    f.actions
  end
end
