class V1::ImageSerializer < V1::BaseSerializer
  include ImagableSerializer
  attributes :id
end