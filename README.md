# PN-Logistic Frontend react

## Chú ý

-   Admin order và client order tương đồng nhau, chỉ khác là client order select thêm own_user

-   Time format, Currency

```js
import { dateFormat, CommonUtils } from "../../../utils";

{
    i.created.time != ""
        ? moment(i.created.time).format(dateFormat.DATE_FORMAT)
        : "...";
}

{
    order.total_price ? (
        CommonUtils.formattedValue(order.total_price)
    ) : (
        <>0 VNĐ</>
    );
}
```

-   Con access state của cha thì dùng props. Cha access state của con thì dùng event listener

-   https://sebhastian.com/this-setstate-is-not-a-function/#:~:text=This%20error%20happens%20when%20JavaScript,or%20inside%20the%20calling%20property

```js
//Hạn chế dùng: bị lỗi về state
abc() {

}
// Nên dùng
abc = () => {

}

```

-   Về z-index:

Radio button z-index = 1.
HeaderTag z-index = 2.

-   Khi user phá url thì tự động redirect về home page

-   onClick và onChange sẽ viết như thế này:

```js
<Button
    type="primary"
    onClick={() => {
        this.showModal();
    }}
>
    Tạo Mới
</Button>
```

-   Quản lý router admin tại routes/System.js

## Về Redux

```js
const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
    };
};
```

-   Đoạn mã này cần xuất hiện ở mọi page check điều kiện đăng nhập
-   Sau khi login, đang ở trang nào trước đó thì về chính trang đó, ko có lệnh transition

```js
this.props.userLoginSuccess(data.userData);
```

## Cấu trúc project trong src

-   asserts: Lưu hình ảnh.
-   components: Một số template components.
-   containers: Source chính các page project
    -   App.js: file chính. Quản lý đường link, route là ở đây.
    -   App.scss: css chính.
    -   common: Các component dùng chung: header, footer, menu,...
    -   admin: Các page admin
    -   home: các page trang khách hàng
    -   Mỗi page sẽ là folder, trong đó thì ko tách folder thêm nữa, giảm phức tạp.
-   Store: Phần xử lý redux.
-   Utils: Các hàm hỗ trợ mặc định
    -   Constant: quy định các link
-   Translations: json để chuyển động ngôn ngữ.
-   Các phần khác nên để mặc định.
-   Thống nhất ghi css chỉ file duy nhất là App.scss

-   Chú ý cả thứ tự import cũng cần thống nhất:

```js
// import thư viện react trước
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { push } from "connected-react-router";

// các tag của antd
import { Form, Input, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Col, Divider, Row } from "antd";
import { Card, Switch } from "antd";

import { Typography } from "antd";
import { createFromIconfontCN } from "@ant-design/icons";
import { Space } from "antd";

import {
    FacebookFilled,
    GithubFilled,
    GoogleCircleFilled,
} from "@ant-design/icons";

// cuối cùng là các component khác
// import "./Login.scss";
import { handleLoginService } from "../../../services/userService";
import { userLoginSuccess } from "../../../store/actions";

// và tới các const
const { Title } = Typography;
```

## Run project

-   Tạo file .env theo mẫu .env.example

```
npm i
npm start
```
