class AtaGenerator < Rails::Generators::NamedBase
  source_root File.expand_path('templates', __dir__)

  def generate_controller
    template "ata.rb", "app/admin/#{name.pluralize}.rb"
  end

  private

  def model_name_ko
    I18n.t("activerecord.models.#{name}") #.force_encoding('UTF-8')
  end

  def model_name
    "#{name.classify}"
  end

  def model_constant
    model_name.constantize
  end

  def columns
    model_constant.column_names
  end

  def attributes
    model_constant.columns[1..]
  end

  def model_enums
    model_constant.defined_enums
  end

  def refined_columns
    model_constant.column_names.map!(&:to_sym) - %i[created_at updated_at id]
  end

  def defined_enum_hash
    model_constant.defined_enums
  end

  def image_url?
    model_constant.included_modules.include?(ImageUrl) rescue false
  end

  def imagable?
    model_constant.included_modules.include?(Imagable) rescue false
  end

  def likable?
    model_constant.included_modules.include?(Likable) rescue false
  end

  def commentable?
    model_constant.included_modules.include?(Commentable) rescue false
  end
end
