ActiveAdmin.register Coupon do
  menu label: "#{I18n.t("activerecord.models.coupon")}"
  scope -> { '전체' }, :all
  
  filter :discount_price, label: "#{I18n.t("activerecord.attributes.coupon.discount_price")} 검색"
  filter :minimum_order_price, label: "#{I18n.t("activerecord.attributes.coupon.minimum_order_price")} 검색"
  filter :created_at, label: "#{I18n.t("activerecord.attributes.coupon.created_at")} 검색"
  filter :expires_at, label: "#{I18n.t("activerecord.attributes.coupon.expires_at")} 검색"
  filter :used_at, label: "#{I18n.t("activerecord.attributes.coupon.used_at")} 검색"

  index do
    selectable_column
    id_column
    br
    a link_to ("10 개씩 보기"), "/admin/coupons?order=id_desc&per_page=10", class: "button small"
    a link_to ("30 개씩 보기"), "/admin/coupons?order=id_desc&per_page=30", class: "button small"
    a link_to ("50 개씩 보기"), "/admin/coupons?order=id_desc&per_page=50", class: "button small"
    a link_to ("모두 보기"), "/admin/coupons?order=id_desc&per_page=#{Coupon.count}", class: "button small"
    column :discount_price
    column :minimum_order_price
    column :created_at  
    column :expires_at
    column :used_at
    column :coupon_number
    actions
  end

  show do
    attributes_table do
      row :id
      row :discount_price
      row :minimum_order_price
      row :coupon_number
      row :created_at  
      row :expires_at
      row :used_at
    end
  end

  form do |f|
    f.object.expires_at = DateTime.now + 14
    f.inputs do
      f.input :coupon_number
      f.input :discount_price
      f.input :minimum_order_price
      f.input :expires_at
    end
    f.actions
  end
end
