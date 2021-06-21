import React from 'react';

export interface EmptyListProps {
  imgUrl?: string;
  text?: string;
  style?: object;
  subText?: string;
  className?: string;
  small?: boolean;
}

const EmptyList: React.FC<EmptyListProps> = ( props ) => {
  const { imgUrl = "/static/images/empty.png", text = "비어있습니다.", subText = null, small = false, style = null } = props;

  return (
    <div className={`flex flex-col justify-center items-center h-full ${props.className ?? ""}`} style={style}>
      <img src={imgUrl} alt="Empty list icon" className="w-24 h-24 mb-5 animate-pulse"/>
      <div className={`${small ? "text-xl" : "text-2xl" } font-bold text-gray-600`}>{text}</div>
      {subText && <div className={`${small ? "text-base" : "text-lg" } font-bold text-gray-400`}>{subText}</div>}
    </div>
  );
};

export default EmptyList;
