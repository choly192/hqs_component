import * as React from "react";
import "./index.css";

const WithProductCard = (TagComponet) => (props) => {
  const TagProductCard:React.FC = () => {
    return (
      <div className="grid-col radius-m bg-white">
      <div className="review">
        {props?.isShowTag && <TagComponet />}
        <div className="review-title">
          <a className="review-title-text font-l">
            Best high performance laptop Easy to install
          </a>
        </div>
        <div className="review-rating">
          <i className="rating rating-5"></i>
        </div>
        <a className="goods-container is-horizontal">
          <div className="goods-img w-80px">
            <img
              src="../Nest/images/items/no_bg_item_04.png"
              alt="ASUS Z590 WIFI GUNDAM EDITION"
            />
          </div>
          <div className="goods-info no-padding-bottom">
            <div className="goods-title line-clamp-3">
              ASUS Z590 WIFI GUNDAM EDITION LGA 1200 ATX Intel Motherboard
            </div>
          </div>
        </a>
        <div className="review-content line-clamp-6">
          <p>
            Ordered a wall outlet surge protector and received a iPhone black
            USB data cable yet the packing slip which was neatly folded in
            fourths so this could be clearly seen "Tenergy 3 AC Outlet Wall
            Mount" How on earth this equates to a tiny USB cable is beyond me.
            My thought is the packer cannot read english. The time involved for
            such a stupid mistake was NOT worth the $12.99 cost of the missing
            product when I had to deal with RMA and such so I finally after
            contacting NewEgg twice by phone a full refund and a extra credit
            and was able to toss the cable in the garbage. I will never purchase
            items from properdirect. I would have been far ahead going to the
            local hardware store and paying the sales tax and a couple extra
            dollars plus a little time and gas.
          </p>
        </div>
        <div className="review-bottom">
          <span className="font-s text-gray">2/25/2016</span>
          <a title="See more detail" className="review-more bg-lightgray">
            <i className="ico ico-angle-right text-darkorange">
              <span className="display-none">See more detail</span>
            </i>
          </a>
        </div>
      </div>
    </div>
    );
  }
  return TagProductCard;
};
export default WithProductCard;
