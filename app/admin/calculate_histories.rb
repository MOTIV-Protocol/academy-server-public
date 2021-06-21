ActiveAdmin.register CalculateHistory do
  menu label: "#{I18n.t("activerecord.models.calculate_history")}"
  
  controller do
    def scoped_collection
      super
      CalculateHistory.includes(:orders)
    end
  end

  scope -> { '전체' }, :all
  scope -> { '처리 필요' }, :yet
  scope -> { '완료' }, :done

  filter :name_cont, label: "#{I18n.t("activerecord.attributes.calculate_history.name")} 검색"
  filter :order_count, label: "#{I18n.t("activerecord.attributes.calculate_history.order_count")} 필터"

  action_item :export, only: :show do
    a "정산 완료", href: done_admin_calculate_history_path(resource)
    a "정산 csv 다운 받기", href: export_admin_calculate_history_path(resource)
  end
  
  member_action :done do
    resource.done!
    redirect_to admin_calculate_history_path(resource)
  end

  member_action :export, method: :get do
    @orders = resource.orders.includes(:school)
    time = Time.current.to_s(:number)
    render xlsx: "#{time} 주문 정산", template: "admin/calculate_histories/export.xlsx.axlsx"
  end

  index do
    selectable_column
    id_column
    br
    a link_to ("10 개씩 보기"), "/admin/calculate_histories?order=id_desc&per_page=10", class: "button small"
    a link_to ("30 개씩 보기"), "/admin/calculate_histories?order=id_desc&per_page=30", class: "button small"
    a link_to ("50 개씩 보기"), "/admin/calculate_histories?order=id_desc&per_page=50", class: "button small"
    a link_to ("모두 보기"), "/admin/calculate_histories?order=id_desc&per_page=#{CalculateHistory.count}", class: "button small"
    column :name
    column :order_count do |calculate_history| "#{calculate_history.order_count}개" end
    column :profit
    column :status do |calculate_history| I18n.t("enum.calculate_history.status.#{calculate_history.status}") end
    actions
  end

  show do
    panel '정산정보' do
      attributes_table_for resource do
        row :id
        row :name
        row :order_count do |calculate_history| "#{calculate_history.order_count}개" end
        row :profit
        row :status do |calculate_history| I18n.t("enum.calculate_history.status.#{calculate_history.status}") end
        row :created_at  
        row :updated_at
      end
    end
    panel '관련주문정보' do
      table_for calculate_history.orders do
        column :user
        column :payment_total
        column :school
        column :pay_method do |order| I18n.t("enum.order.pay_method.#{order.pay_method}") end
        column :completed_at
        column "상세정보" do |order|
          link_to '보러가기', admin_order_path(order.id), target: :_blank
        end
      end
    end
  end

  form do |f|
    f.inputs do
      f.input :name
      f.input :status, collection: I18n.t("enum.calculate_history.status").invert.to_a
    end
    f.actions
  end
end
